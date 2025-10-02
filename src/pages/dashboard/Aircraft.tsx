import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Aircraft = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    tail_number: "",
    manufacturer: "",
    model: "",
    year: "",
    serial_number: "",
  });

  const { data: aircraft, isLoading } = useQuery({
    queryKey: ["aircraft"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aircraft")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addAircraftMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("aircraft").insert({
        ...data,
        year: data.year ? parseInt(data.year) : null,
        user_id: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aircraft"] });
      setOpen(false);
      setFormData({
        tail_number: "",
        manufacturer: "",
        model: "",
        year: "",
        serial_number: "",
      });
      toast({
        title: "Success",
        description: "Aircraft added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAircraftMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Aircraft Fleet</h1>
          <p className="text-muted-foreground">Manage your aircraft fleet</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Aircraft
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Aircraft</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tail_number">Tail Number *</Label>
                <Input
                  id="tail_number"
                  value={formData.tail_number}
                  onChange={(e) => setFormData({ ...formData, tail_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addAircraftMutation.isPending}>
                {addAircraftMutation.isPending ? "Adding..." : "Add Aircraft"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : aircraft && aircraft.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aircraft.map((item) => (
            <Card key={item.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.tail_number}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {item.manufacturer && <p>Manufacturer: {item.manufacturer}</p>}
                {item.model && <p>Model: {item.model}</p>}
                {item.year && <p>Year: {item.year}</p>}
                {item.serial_number && <p>Serial: {item.serial_number}</p>}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No aircraft added yet</p>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Aircraft
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Aircraft;
